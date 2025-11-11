"use client"

import { Card } from "@/components/ui/card"

const routines = [
  {
    name: "Morning Routine",
    icon: "🌅",
    steps: [
      "Gentle cleanser - Remove overnight oils",
      "Toner - Balance pH levels",
      "Serum - Hydration and antioxidants",
      "Moisturizer - Lock in hydration",
      "Sunscreen SPF 30+ - UV protection",
    ],
  },
  {
    name: "Evening Routine",
    icon: "🌙",
    steps: [
      "Makeup remover - Double cleanse",
      "Gentle cleanser - Remove impurities",
      "Exfoliate (2-3x weekly) - Remove dead skin",
      "Treatment serum - Targeted care",
      "Night moisturizer - Deep hydration",
    ],
  },
  {
    name: "Weekly Treatments",
    icon: "💆",
    steps: [
      "Face mask (1-2x) - Deep cleansing",
      "Exfoliating scrub (2-3x) - Renewal",
      "Hydrating mask - Intensive moisture",
      "Clay mask - Pore cleansing",
      "Rest days - Let skin recover",
    ],
  },
]

export function SkinRoutines() {
  return (
    <section id="routines" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-foreground mb-4">
            Daily Skin Care Routines
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build healthy skin habits with our expert-recommended routines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {routines.map((routine, idx) => (
            <Card key={idx} className="p-6 bg-card/50 backdrop-blur-xl border border-white/10 hover:border-primary/50 shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">{routine.icon}</div>
              <h3 className="text-2xl font-bold font-headline text-primary mb-4">{routine.name}</h3>
              <ul className="space-y-3">
                {routine.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-muted-foreground">
                    <span className="text-accent font-bold text-lg leading-none mt-0.5">✧</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
