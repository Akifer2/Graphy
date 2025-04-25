import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { BlockMath } from "react-katex";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar, BarChart } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";

type StatCardProps = {
    title: string
    extra?: string
    data: { name: string; count: number }[]
    latex?: string[]
}

export default function StatCard({ title, extra, data, latex }: StatCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
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
