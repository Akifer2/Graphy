"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import Layout from "./layouts/layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export default function App() {
  const { t } = useTranslation()
  const [valuesInput, setValuesInput] = useState<string>("")
  const [weightsInput, setWeightsInput] = useState<string>("")
  const [stats, setStats] = useState<{
    mean: number
    weightedMean: number
    mode: number[]
    noMode: boolean
    median: number
    variance: number
    weightedVariance: number
    stdDev: number
    weightedStdDev: number
    coefVar: number
    weightedCoefVar: number
  }>({
    mean: 0,
    weightedMean: 0,
    mode: [],
    noMode: false,
    median: 0,
    variance: 0,
    weightedVariance: 0,
    stdDev: 0,
    weightedStdDev: 0,
    coefVar: 0,
    weightedCoefVar: 0,
  })
  const [frequencyData, setFrequencyData] = useState<{ name: string; count: number }[]>([])

  const calculateStats = (values: number[], weights: number[]) => {
    const n = values.length
    // Mean
    const mean = Number.parseFloat((values.reduce((a, b) => a + b, 0) / n).toFixed(2))
    // Weighted Mean
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const weightedMean = Number.parseFloat(
      (values.reduce((sum, v, i) => sum + v * weights[i], 0) / totalWeight).toFixed(2),
    )
    // Frequency
    const freq: Record<number, number> = {}
    values.forEach((v) => (freq[v] = (freq[v] || 0) + 1))
    const maxFreq = Math.max(...Object.values(freq))
    const mode =
      maxFreq > 1
        ? Object.entries(freq)
          .filter(([_, count]) => count === maxFreq)
          .map(([value]) => Number.parseFloat(value))
        : []
    const noMode = maxFreq <= 1
    // Median
    const sorted = [...values].sort((a, b) => a - b)
    const median = Number.parseFloat(
      (n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]).toFixed(2),
    )
    // Variance
    const variance = Number.parseFloat((values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n).toFixed(2))
    // Weighted Variance
    const weightedVariance = Number.parseFloat(
      (values.reduce((sum, v, i) => sum + weights[i] * Math.pow(v - weightedMean, 2), 0) / totalWeight).toFixed(2),
    )
    // Std Dev
    const stdDev = Number.parseFloat(Math.sqrt(variance).toFixed(2))
    const weightedStdDev = Number.parseFloat(Math.sqrt(weightedVariance).toFixed(2))
    // Coef Var
    const coefVar = Number.parseFloat(((stdDev / mean) * 100).toFixed(2))
    const weightedCoefVar = Number.parseFloat(((weightedStdDev / weightedMean) * 100).toFixed(2))
    // Frequency data
    const freqData = Object.entries(freq).map(([key, count]) => ({
      name: key,
      count,
    }))

    setStats({
      mean,
      weightedMean,
      mode,
      noMode,
      median,
      variance,
      weightedVariance,
      stdDev,
      weightedStdDev,
      coefVar,
      weightedCoefVar,
    })
    setFrequencyData(freqData)
  }

  const handleCalculate = () => {
    const values = valuesInput
      .split(/[,;\s]+/)
      .map((v) => Number.parseFloat(v))
      .filter((v) => !isNaN(v))
    const weights = weightsInput
      .split(/[,;\s]+/)
      .map((w) => Number.parseFloat(w))
      .filter((w) => !isNaN(w))
    if (values.length !== weights.length) {
      alert(t("calculator.errorMessage"))
      return
    }
    calculateStats(values, weights)
  }

  return (
    <Layout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t("calculator.title")}</CardTitle>
          <CardDescription>{t("calculator.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input
            placeholder={t("calculator.values")}
            value={valuesInput}
            onChange={(e) => setValuesInput(e.target.value)}
          />
          <Input
            placeholder={t("calculator.weights")}
            value={weightsInput}
            onChange={(e) => setWeightsInput(e.target.value)}
          />
          <Button onClick={handleCalculate}>{t("calculator.calculate")}</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue={t("stats.mean")} className="w-full">
        <TabsList>
          <TabsTrigger value={t("stats.mean")}>{t("stats.mean")}</TabsTrigger>
          <TabsTrigger value={t("stats.mode")}>{t("stats.mode")}</TabsTrigger>
          <TabsTrigger value={t("stats.median")}>{t("stats.median")}</TabsTrigger>
          <TabsTrigger value={t("stats.variance")}>{t("stats.variance")}</TabsTrigger>
          <TabsTrigger value={t("stats.stdDev")}>{t("stats.stdDev")}</TabsTrigger>
          <TabsTrigger value={t("stats.coefVar")}>{t("stats.coefVar")}</TabsTrigger>
        </TabsList>

        {/* Mean Tab */}
        <TabsContent value={t("stats.mean")}>
          <Card>
            <CardHeader>
              <CardTitle>
                {t("stats.mean")}: {stats.mean}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("stats.weightedMean")}: {stats.weightedMean}
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
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
                  {frequencyData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Mode Tab */}
        <TabsContent value={t("stats.mode")}>
          <Card>
            <CardHeader>
              <CardTitle>{stats.noMode ? t("stats.noMode") : `${t("stats.mode")}: ${stats.mode.join(", ")}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
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
                  {frequencyData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Median Tab */}
        <TabsContent value={t("stats.median")}>
          <Card>
            <CardHeader>
              <CardTitle>
                {t("stats.median")}: {stats.median}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variance Tab */}
        <TabsContent value={t("stats.variance")}>
          <Card>
            <CardHeader>
              <CardTitle>
                {t("stats.variance")}: {stats.variance}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("stats.weightedVariance")}: {stats.weightedVariance}
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Std Dev Tab */}
        <TabsContent value={t("stats.stdDev")}>
          <Card>
            <CardHeader>
              <CardTitle>
                {t("stats.stdDev")}: {stats.stdDev}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("stats.weightedStdDev")}: {stats.weightedStdDev}
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coef Var Tab */}
        <TabsContent value={t("stats.coefVar")}>
          <Card>
            <CardHeader>
              <CardTitle>
                {t("stats.coefVar")}: {stats.coefVar}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("stats.weightedCoefVar")}: {stats.weightedCoefVar}%
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}
