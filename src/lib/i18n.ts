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
        description: "Enter values and corresponding weights separated by commas or spaces",
        values: "Values e.g. 10 20 20 30",
        weights: "Weights e.g. 1 2 1 3",
        calculate: "Calculate",
        errorMessage: "Values and weights must have the same length",
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
        description: "Insira valores e pesos correspondentes separados por vírgulas ou espaços",
        values: "Valores ex: 10 20 20 30",
        weights: "Pesos ex: 1 2 1 3",
        calculate: "Calcular",
        errorMessage: "Valores e pesos devem ter o mesmo comprimento",
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
        description: "Ingrese valores y pesos correspondientes separados por comas o espacios",
        values: "Valores ej: 10 20 20 30",
        weights: "Pesos ej: 1 2 1 3",
        calculate: "Calcular",
        errorMessage: "Los valores y pesos deben tener la misma longitud",
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
