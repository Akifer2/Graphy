import { useState } from "react"
import { useTranslation } from "react-i18next"
import Layout from "./layouts/layout"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"

type DataRow = {
  id: number;
  value: string;
  weight: string
}

type StepsMap = Record<string, string[]>

export default function App() {
  const { t } = useTranslation()

  /* ──────────────────── estados ──────────────────── */
  const [useWeights, setUseWeights] = useState(false)
  const [dataRows, setDataRows] = useState<DataRow[]>([{ id: 1, value: "", weight: "" }])
  const [stats, setStats] = useState<any>({
    mean: 0, weightedMean: 0, mode: [], noMode: false,
    median: 0, variance: 0, weightedVariance: 0,
    stdDev: 0, weightedStdDev: 0,
    coefVar: 0, weightedCoefVar: 0
  })
  const [frequencyData, setFrequencyData] = useState<{ name: string; count: number }[]>([])
  const [calcSteps, setCalcSteps] = useState<StepsMap>({})

  /* ────────────────── handlers UI ─────────────────── */
  const addRow = () => {
    const nextId = dataRows.length ? Math.max(...dataRows.map(r => r.id)) + 1 : 1
    setDataRows([...dataRows, { id: nextId, value: "", weight: "" }])
  }

  const removeRow = (id: number) => {
    if (dataRows.length > 1) setDataRows(dataRows.filter(r => r.id !== id))
  }

  const updateRowValue = (id: number, field: "value" | "weight", newValue: string) => {
    setDataRows(dataRows.map(r => (r.id === id ? { ...r, [field]: newValue } : r)))
  }

  /* ─────────────── cálculo estatístico ────────────── */
  const calculateStats = (values: number[], weights: number[]) => {
    const n = values.length
    const sum = values.reduce((a, b) => a + b, 0)
    const mean = +(sum / n).toFixed(2)
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const weightedMean = +(
      values.reduce((s, v, i) => s + v * weights[i], 0) / totalWeight
    ).toFixed(2)

    /* frequências e moda */
    const freq: Record<number, number> = {}
    values.forEach(v => (freq[v] = (freq[v] || 0) + 1))
    const maxFreq = Math.max(...Object.values(freq))
    const mode =
      maxFreq > 1 ? Object.entries(freq).filter(([, c]) => c === maxFreq).map(([v]) => +v) : []
    const noMode = maxFreq <= 1

    /* mediana */
    const sorted = [...values].sort((a, b) => a - b)
    const median = +(
      n % 2
        ? sorted[Math.floor(n / 2)]
        : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    ).toFixed(2)

    /* variância / desvio */
    const variance = +(values.reduce((s, v) => s + (v - mean) ** 2, 0) / n).toFixed(2)
    const weightedVariance = +(
      values.reduce((s, v, i) => s + weights[i] * (v - weightedMean) ** 2, 0) / totalWeight
    ).toFixed(2)
    const stdDev = +Math.sqrt(variance).toFixed(2)
    const weightedStdDev = +Math.sqrt(weightedVariance).toFixed(2)

    /* coeficiente de variação */
    const coefVar = +((stdDev / mean) * 100).toFixed(2)
    const weightedCoefVar = +((weightedStdDev / weightedMean) * 100).toFixed(2)

    /* preparação de passos */
    const steps: StepsMap = {}
    steps.mean = [`Σx = ${sum}`, `x̄ = Σx / n = ${mean}`]
    steps.weightedMean = [
      `Σ(wx) = ${values.reduce((s, v, i) => s + v * weights[i], 0)}`,
      `Σw = ${totalWeight}`,
      `x̄₍w₎ = Σ(wx) / Σw = ${weightedMean}`
    ]
    steps.median = [`Valores ordenados = [${sorted.join(", ")}]`, `Mediana = ${median}`]
    steps.mode = noMode
      ? ["Sem moda (frequências ≤ 1)"]
      : [`Mapa de frequências = ${JSON.stringify(freq)}`, `Moda = [${mode.join(", ")}]`]
    steps.variance = [`σ² = Σ(x − x̄)² / n = ${variance}`]
    steps.stdDev = [`σ = √σ² = ${stdDev}`]
    steps.coefVar = [`CV = σ / x̄ · 100 = ${coefVar}%`]

    /* gráfico */
    const freqData = Object.entries(freq).map(([name, count]) => ({ name, count }))

    /* atualiza estados */
    setStats({
      mean, weightedMean, mode, noMode, median,
      variance, weightedVariance,
      stdDev, weightedStdDev,
      coefVar, weightedCoefVar
    })
    setFrequencyData(freqData)
    setCalcSteps(steps)
  }

  const handleCalculate = () => {
    const values = dataRows.map(r => parseFloat(r.value)).filter(v => !isNaN(v))
    if (!values.length) { alert("Insira ao menos um valor válido."); return }
    const weights = useWeights
      ? dataRows.map(r => parseFloat(r.weight) || 1).slice(0, values.length)
      : Array(values.length).fill(1)
    calculateStats(values, weights)
  }

  return (
    <Layout>
      {/* formulário de entrada */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t("calculator.title")}</CardTitle>
          <CardDescription>{t("calculator.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="use-weights"
              checked={useWeights}
              onCheckedChange={chk => setUseWeights(chk === true)}
            />
            <label htmlFor="use-weights" className="text-sm font-medium leading-none">
              {t("calculator.useWeights")}
            </label>
          </div>

          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                {useWeights && <TableHead>Peso</TableHead>}
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataRows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.value}
                      onChange={e => updateRowValue(row.id, "value", e.target.value)}
                      placeholder="Valor"
                    />
                  </TableCell>
                  {useWeights && (
                    <TableCell>
                      <Input
                        type="number"
                        value={row.weight}
                        onChange={e => updateRowValue(row.id, "weight", e.target.value)}
                        placeholder="Peso (padrão 1)"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(row.id)}
                      disabled={dataRows.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-2">
            <Button variant="outline" onClick={addRow} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Adicionar linha
            </Button>
            <Button onClick={handleCalculate}>{t("calculator.calculate")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* resultados */}
      <Tabs defaultValue={t("stats.mean")} className="w-full">
        <TabsList>
          <TabsTrigger value={t("stats.mean")}>{t("stats.mean")}</TabsTrigger>
          <TabsTrigger value={t("stats.mode")}>{t("stats.mode")}</TabsTrigger>
          <TabsTrigger value={t("stats.median")}>{t("stats.median")}</TabsTrigger>
          <TabsTrigger value={t("stats.variance")}>{t("stats.variance")}</TabsTrigger>
          <TabsTrigger value={t("stats.stdDev")}>{t("stats.stdDev")}</TabsTrigger>
          <TabsTrigger value={t("stats.coefVar")}>{t("stats.coefVar")}</TabsTrigger>
        </TabsList>

        {/* MÉDIA */}
        <TabsContent value={t("stats.mean")}>
          <Card>
            <CardHeader>
              <CardTitle>{t("stats.mean")}: {stats.mean}</CardTitle>
              {useWeights && <p>{t("stats.weightedMean")}: {stats.weightedMean}</p>}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>

              {/* passos */}
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="steps">
                  <AccordionTrigger>Detalhamento do cálculo</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside">
                      {calcSteps.mean?.map((s, i) => <li key={i}>{s}</li>)}
                      {useWeights && calcSteps.weightedMean?.map((s, i) => <li key={i + 10}>{s}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODA */}
        <TabsContent value={t("stats.mode")}>
          <Card>
            <CardHeader>
              <CardTitle>
                {stats.noMode ? t("stats.noMode") : `${t("stats.mode")}: ${stats.mode.join(", ")}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>

              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="steps">
                  <AccordionTrigger>Detalhamento do cálculo</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside">
                      {calcSteps.mode?.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.value")}</TableHead>
                    <TableHead>{t("table.count")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {frequencyData.map(r => (
                    <TableRow key={r.name}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* MEDIANA */}
        <TabsContent value={t("stats.median")}>
          <Card>
            <CardHeader>
              <CardTitle>{t("stats.median")}: {stats.median}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>

              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="steps">
                  <AccordionTrigger>Detalhamento do cálculo</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside">
                      {calcSteps.median?.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VARIÂNCIA */}
        <TabsContent value={t("stats.variance")}>
          <Card>
            <CardHeader>
              <CardTitle>{t("stats.variance")}: {stats.variance}</CardTitle>
              {useWeights && <p>{t("stats.weightedVariance")}: {stats.weightedVariance}</p>}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>

              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="steps">
                  <AccordionTrigger>Detalhamento do cálculo</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside">
                      {calcSteps.variance?.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DESVIO-PADRÃO */}
        <TabsContent value={t("stats.stdDev")}>
          <Card>
            <CardHeader>
              <CardTitle>{t("stats.stdDev")}: {stats.stdDev}</CardTitle>
              {useWeights && <p>{t("stats.weightedStdDev")}: {stats.weightedStdDev}</p>}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>

              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="steps">
                  <AccordionTrigger>Detalhamento do cálculo</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside">
                      {calcSteps.stdDev?.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COEF. DE VARIAÇÃO */}
        <TabsContent value={t("stats.coefVar")}>
          <Card>
            <CardHeader>
              <CardTitle>{t("stats.coefVar")}: {stats.coefVar}%</CardTitle>
              {useWeights && <p>{t("stats.weightedCoefVar")}: {stats.weightedCoefVar}%</p>}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>

              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="steps">
                  <AccordionTrigger>Detalhamento do cálculo</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside">
                      {calcSteps.coefVar?.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}
