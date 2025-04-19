import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const enTranslations = {
    app: {
        title: "Graphy",
        subtitle: "Welcome to Graphy! This is a simple graphing tool that allows you to calculate graphs.",
        language: "Language",
    },
    calculator: {
        title: "Statistical Calculator",
        useWeights: "Usar pesos?",
        description: "Enter values and their corresponding weights in the table below",
        addRow: "Add row",
        value: "Value",
        weight: "Weight",
        remove: "Remove",
        calculate: "Calculate",
        errorMessage: "Values and weights must have the same length",
        emptyDataError: "Please enter at least one valid value and weight."
    },
    stats: {
        mean: "Mean",
        weightedMean: "Weighted Mean",
        mode: "Mode",
        noMode: "There's no mode",
        median: "Median",
        variance: "Variance",
        weightedVariance: "Weighted Variance",
        stdDev: "Std. Dev.",
        weightedStdDev: "Weighted Std. Dev.",
        coefVar: "Coeff. Var.",
        weightedCoefVar: "Weighted Coeff. Var.",
    },
    table: {
        value: "Value",
        count: "Count",
    },
}

const ptTranslations = {
    app: {
        title: "Graphy",
        subtitle: "Bem-vindo ao Graphy! Esta é uma ferramenta simples de gráficos que permite calcular estatísticas.",
        language: "Idioma",
    },
    calculator: {
        title: "Calculadora Estatística",
        useWeights: "Use weights?",
        description: "Insira valores e seus pesos correspondentes na tabela abaixo",
        addRow: "Adicionar linha",
        value: "Valor",
        weight: "Peso",
        remove: "Remover",
        calculate: "Calcular",
        errorMessage: "Valores e pesos devem ter o mesmo comprimento",
        emptyDataError: "Por favor, insira pelo menos um valor e peso válidos."
    },
    stats: {
        mean: "Média",
        weightedMean: "Média Ponderada",
        mode: "Moda",
        noMode: "Não há moda",
        median: "Mediana",
        variance: "Variância",
        weightedVariance: "Variância Ponderada",
        stdDev: "Desvio Padrão",
        weightedStdDev: "Desvio Padrão Ponderado",
        coefVar: "Coef. de Variação",
        weightedCoefVar: "Coef. de Variação Ponderado",
    },
    table: {
        value: "Valor",
        count: "Contagem",
    },
}

const esTranslations = {
    app: {
        title: "Graphy",
        subtitle: "¡Bienvenido a Graphy! Esta es una herramienta gráfica simple que permite calcular gráficos.",
        language: "Idioma",
    },
    calculator: {
        title: "Calculadora Estadística",
        useWeights: "¿Utilizar pesos?",
        description: "Ingrese valores y sus pesos correspondientes en la tabla a continuación",
        addRow: "Añadir fila",
        value: "Valor",
        weight: "Peso",
        remove: "Eliminar",
        calculate: "Calcular",
        errorMessage: "Los valores y pesos deben tener la misma longitud",
        emptyDataError: "Por favor, ingrese al menos un valor y peso válidos."
    },
    stats: {
        mean: "Media",
        weightedMean: "Media Ponderada",
        mode: "Moda",
        noMode: "No hay moda",
        median: "Mediana",
        variance: "Varianza",
        weightedVariance: "Varianza Ponderada",
        stdDev: "Desv. Estándar",
        weightedStdDev: "Desv. Estándar Ponderada",
        coefVar: "Coef. de Variación",
        weightedCoefVar: "Coef. de Variación Ponderado",
    },
    table: {
        value: "Valor",
        count: "Conteo",
    },
}

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslations },
        pt: { translation: ptTranslations },
        es: { translation: esTranslations },
    },
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
})

export default i18n