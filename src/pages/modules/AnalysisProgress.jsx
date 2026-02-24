import { useState, useEffect } from 'react'

const steps = [
    { id: 1, label: 'Fetching competitor data', duration: 1200 },
    { id: 2, label: 'Running Gemini analysis', duration: 1800 },
    { id: 3, label: 'Scoring across 4 dimensions', duration: 1400 },
    { id: 4, label: 'Building intelligence report', duration: 1000 },
]

export default function AnalysisProgress({ isLoading }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [stepProgress, setStepProgress] = useState(0)

    useEffect(() => {
        if (!isLoading) { setCurrentStep(0); setStepProgress(0); return }
        let stepIndex = 0
        const runStep = () => {
            if (stepIndex >= steps.length) return
            setCurrentStep(stepIndex)
            setStepProgress(0)
            const step = steps[stepIndex]
            const interval = 30
            const increment = (interval / step.duration) * 100
            let progress = 0
            const timer = setInterval(() => {
                progress += increment
                setStepProgress(Math.min(progress, 100))
                if (progress >= 100) {
                    clearInterval(timer)
                    stepIndex++
                    setTimeout(runStep, 200)
                }
            }, interval)
        }
        runStep()
    }, [isLoading])

    if (!isLoading) return null

    const overall = ((currentStep / steps.length) * 100) + (stepProgress / steps.length)

    return (
        <div style={{ background: '#FFFFFF', border: '1.5px solid #D9CEBA', borderRadius: '10px', padding: '24px', margin: '16px 0' }}>
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A18' }}>Analysing competitors</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#E86A2A' }}>{Math.round(overall)}%</span>
                </div>
                <div style={{ height: '6px', background: '#EDE6DA', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${overall}%`, background: '#E86A2A', borderRadius: '10px', transition: 'width 0.1s ease' }} />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {steps.map((step, index) => {
                    const isDone = index < currentStep
                    const isActive = index === currentStep
                    return (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, background: isDone ? '#1A1A18' : isActive ? '#E86A2A' : '#EDE6DA', color: isDone || isActive ? 'white' : '#9E9790', transition: 'all 0.3s ease' }}>
                                {isDone ? '✓' : step.id}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12.5px', fontWeight: isActive ? 600 : 400, color: isDone ? '#6B6560' : isActive ? '#1A1A18' : '#9E9790', marginBottom: isActive ? '5px' : '0' }}>
                                    {step.label}
                                </div>
                                {isActive && (
                                    <div style={{ height: '3px', background: '#EDE6DA', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${stepProgress}%`, background: '#E86A2A', borderRadius: '10px', transition: 'width 0.1s ease' }} />
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: isDone ? '#2A7A50' : isActive ? '#E86A2A' : '#9E9790' }}>
                                {isDone ? 'Done' : isActive ? 'Running' : 'Waiting'}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
