"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import Layout from "./layouts/layout"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell
} from "@/components/ui/table"
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent
} from "@/components/ui/accordion"

/*  ─── KaTeX ─── */
import "katex/dist/katex.min.css"
import { BlockMath } from "react-katex"

type DataRow = { id: number; value: string; weight: string }
type StepsMap = Record<string, string[]>

export default function App() {
  const { t } = useTranslation()

  /* Estados principais */
  const [useWeights, setUseWeights] = useState(false)
  const [dataRows, setDataRows] = useState<DataRow[]>([{ id: 1, value: "", weight: "" }])
  const [stats, setStats] = useState<any>({
    mean: 0, weightedMean: 0, mode: [], noMode: false,
    median: 0, variance: 0, weightedVariance: 0,
    stdDev: 0, weightedStdDev: 0,
    coefVar: 0, weightedCoefVar: 0
  })
  const [frequencyData, setFrequencyData] = useState<{ name: string; count: number }[]>([])
  const [latexSteps, setLatexSteps] = useState<StepsMap>({})

  /* UI handlers */
  const addRow = () => {
    const id = dataRows.length ? Math.max(...dataRows.map(r => r.id)) + 1 : 1
    setDataRows([...dataRows, { id, value: "", weight: "" }])
  }

  const removeRow = (id: number) => {
    if (dataRows.length > 1) setDataRows(dataRows.filter(r => r.id !== id))
  }

  const updateRowValue = (id: number, field: "value" | "weight", val: string) => {
    setDataRows(dataRows.map(r => (r.id === id ? { ...r, [field]: val } : r)))
  }

  /* Cálculos */
  const calculateStats = (values: number[], weights: number[]) => {
    const n = values.length
    const sum = values.reduce((a, b) => a + b, 0)
    const mean = +(sum / n).toFixed(2)

    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const weightedMean = +(
      values.reduce((s, v, i) => s + v * weights[i], 0) / totalWeight
    ).toFixed(2)

    /* Frequência e moda */
    const freq: Record<number, number> = {}
    values.forEach(v => (freq[v] = (freq[v] || 0) + 1))
    const maxFreq = Math.max(...Object.values(freq))
    const mode =
      maxFreq > 1 ? Object.entries(freq).filter(([, c]) => c === maxFreq).map(([v]) => +v) : []
    const noMode = maxFreq <= 1

    /* Mediana */
    const sorted = [...values].sort((a, b) => a - b)
    const median = +(
      n % 2 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    ).toFixed(2)

    /* Variância, desvio-padrão, CV */
    const variance = +(values.reduce((s, v) => s + (v - mean) ** 2, 0) / n).toFixed(2)
    const stdDev = +Math.sqrt(variance).toFixed(2)
    const coefVar = +((stdDev / mean) * 100).toFixed(2)

    const weightedVariance = +(
      values.reduce((s, v, i) => s + weights[i] * (v - weightedMean) ** 2, 0) / totalWeight
    ).toFixed(2)
    const weightedStdDev = +Math.sqrt(weightedVariance).toFixed(2)
    const weightedCoefVar = +((weightedStdDev / weightedMean) * 100).toFixed(2)

    /* Frequência para gráfico */
    const freqData = Object.entries(freq).map(([name, count]) => ({ name, count }))

    /* ─── LaTeX steps ─── */
    const L: StepsMap = {}
    L.mean = [
      `\\displaystyle \\sum_{i=1}^{${n}} x_i = ${sum}`,
      `\\bar{x} = \\frac{${sum}}{${n}} = ${mean}`
    ]
    if (useWeights) {
      L.mean.push(
        `\\bar{x}_{\\text{w}} = \\frac{\\sum w_i x_i}{\\sum w_i} = ${weightedMean}`
      )
    }

    L.median = [
      `\\text{Dados ordenados: } ${sorted.join(",\\;")}`,
      `\\tilde{x} = ${median}`
    ]

    L.mode = noMode
      ? [`\\text{Sem moda (todas as frequências }\\le 1)`]
      : [
        `\\text{Mapa de frequências: } ${JSON.stringify(freq).replace(/"/g, "")}`,
        `\\text{Moda(s): } ${mode.join(",\\;")}`
      ]

    L.variance = [
      `\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^{2}}{n} = ${variance}`
    ]
    if (useWeights) {
      L.variance.push(
        `\\sigma^2_{\\text{w}} = \\frac{\\sum w_i (x_i - \\bar{x}_{\\text{w}})^{2}}{\\sum w_i} = ${weightedVariance}`
      )
    }

    L.stdDev = [
      `\\sigma = \\sqrt{\\sigma^2} = ${stdDev}`
    ]
    if (useWeights) {
      L.stdDev.push(`\\sigma_{\\text{w}} = ${weightedStdDev}`)
    }

    L.coefVar = [
      `CV = \\frac{\\sigma}{\\bar{x}} \\times 100\\% = ${coefVar}\\%`
    ]
    if (useWeights) {
      L.coefVar.push(
        `CV_{\\text{w}} = \\frac{\\sigma_{\\text{w}}}{\\bar{x}_{\\text{w}}} \\times 100\\% = ${weightedCoefVar}\\%`
      )
    }

    setLatexSteps(L)
    setStats({
      mean, weightedMean, mode, noMode, median,
      variance, weightedVariance,
      stdDev, weightedStdDev,
      coefVar, weightedCoefVar
    })
    setFrequencyData(freqData)
  }

  const handleCalculate = () => {
    const values = dataRows.map(r => parseFloat(r.value)).filter(v => !isNaN(v))
    if (!values.length) {
      alert("Por favor, insira pelo menos um valor válido.")
      return
    }
    const weights = useWeights
      ? dataRows.map(r => parseFloat(r.weight) || 1).slice(0, values.length)
      : Array(values.length).fill(1)
    calculateStats(values, weights)
  }

  /* ─── UI ─── */
  return (
    <Layout>
      {/* Formulário principal (inalterado) */}
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
              onCheckedChange={c => setUseWeights(c === true)}
            />
            <label htmlFor="use-weights" className="text-sm font-medium">
              {t("calculator.useWeights")}
            </label>
          </div>

          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                {useWeights && <TableHead>Peso</TableHead>}
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataRows.map(r => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Input
                      type="number"
                      value={r.value}
                      onChange={e => updateRowValue(r.id, "value", e.target.value)}
                      placeholder="Valor"
                    />
                  </TableCell>
                  {useWeights && (
                    <TableCell>
                      <Input
                        type="number"
                        value={r.weight}
                        onChange={e => updateRowValue(r.id, "weight", e.target.value)}
                        placeholder="Peso (default 1)"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(r.id)}
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
            <Button variant="outline" onClick={addRow}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar linha
            </Button>
            <Button onClick={handleCalculate}>{t("calculator.calculate")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de resultados */}
      <Tabs defaultValue={t("stats.mean")} className="w-full">
        <TabsList>
          <TabsTrigger value={t("stats.mean")}>{t("stats.mean")}</TabsTrigger>
          <TabsTrigger value={t("stats.mode")}>{t("stats.mode")}</TabsTrigger>
          <TabsTrigger value={t("stats.median")}>{t("stats.median")}</TabsTrigger>
          <TabsTrigger value={t("stats.variance")}>{t("stats.variance")}</TabsTrigger>
          <TabsTrigger value={t("stats.stdDev")}>{t("stats.stdDev")}</TabsTrigger>
          <TabsTrigger value={t("stats.coefVar")}>{t("stats.coefVar")}</TabsTrigger>
        </TabsList>

        {/* --- MÉDIA --- */}
        <TabsContent value={t("stats.mean")}>
          <StatCard
            title={`${t("stats.mean")}: ${stats.mean}`}
            extra={useWeights ? `${t("stats.weightedMean")}: ${stats.weightedMean}` : undefined}
            data={frequencyData}
            latex={latexSteps.mean}
          />
        </TabsContent>

        {/* --- MODA --- */}
        <TabsContent value={t("stats.mode")}>
          <StatCard
            title={
              stats.noMode
                ? t("stats.noMode")
                : `${t("stats.mode")}: ${stats.mode.join(", ")}`
            }
            data={frequencyData}
            latex={latexSteps.mode}
          />
        </TabsContent>

        {/* --- MEDIANA --- */}
        <TabsContent value={t("stats.median")}>
          <StatCard
            title={`${t("stats.median")}: ${stats.median}`}
            data={frequencyData}
            latex={latexSteps.median}
          />
        </TabsContent>

        {/* --- VARIÂNCIA --- */}
        <TabsContent value={t("stats.variance")}>
          <StatCard
            title={`${t("stats.variance")}: ${stats.variance}`}
            extra={
              useWeights
                ? `${t("stats.weightedVariance")}: ${stats.weightedVariance}`
                : undefined
            }
            data={frequencyData}
            latex={latexSteps.variance}
          />
        </TabsContent>

        {/* --- DESVIO-PADRÃO --- */}
        <TabsContent value={t("stats.stdDev")}>
          <StatCard
            title={`${t("stats.stdDev")}: ${stats.stdDev}`}
            extra={useWeights ? `${t("stats.weightedStdDev")}: ${stats.weightedStdDev}` : undefined}
            data={frequencyData}
            latex={latexSteps.stdDev}
          />
        </TabsContent>

        {/* --- COEF. VARIAÇÃO --- */}
        <TabsContent value={t("stats.coefVar")}>
          <StatCard
            title={`${t("stats.coefVar")}: ${stats.coefVar}%`}
            extra={useWeights ? `${t("stats.weightedCoefVar")}: ${stats.weightedCoefVar}%` : undefined}
            data={frequencyData}
            latex={latexSteps.coefVar}
          />
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

/* ───────────────────── componente auxiliar ───────────────────── */
type StatCardProps = {
  title: string
  extra?: string
  data: { name: string; count: number }[]
  latex?: string[]
}
function StatCard({ title, extra, data, latex }: StatCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {extra && <p className="mb-2">{extra}</p>}

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>

        {latex && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="steps">
              <AccordionTrigger>Detalhamento do cálculo</AccordionTrigger>
              <AccordionContent>
                {latex.map((expr, i) => (
                  <BlockMath key={i} math={expr} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>

      {/* tabela de frequência opcional */}
      {data.length > 0 && (
        <CardFooter>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Frequência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(d => (
                <TableRow key={d.name}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardFooter>
      )}
    </Card>
  )
}
