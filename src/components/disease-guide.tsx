"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const diseases = [
  {
    name: "Acne",
    description: "Pimples, blackheads, and cysts caused by oil and bacteria.",
    precautions: [
      "Keep skin clean but don't over-wash",
      "Use non-comedogenic products",
      "Avoid touching your face",
      "Change pillowcase regularly",
      "Manage stress and get adequate sleep",
    ],
  },
  {
    name: "Eczema",
    description: "Dry, inflamed, and itchy skin condition, also known as atopic dermatitis.",
    precautions: [
      "Use fragrance-free moisturizers daily",
      "Avoid harsh soaps and hot water",
      "Wear soft, breathable fabrics like cotton",
      "Identify and avoid personal triggers",
      "Use a humidifier in dry environments",
    ],
  },
  {
    name: "Psoriasis",
    description: "An autoimmune condition causing red, scaly patches that are itchy.",
    precautions: [
      "Keep skin moisturized daily",
      "Avoid stress and get enough sleep",
      "Limit alcohol consumption and don't smoke",
      "Use gentle, fragrance-free cleansers",
      "Get moderate, safe sun exposure",
    ],
  },
  {
    name: "Rosacea",
    description: "A condition causing facial redness, visible blood vessels, and bumps.",
    precautions: [
      "Avoid triggers like spicy foods and alcohol",
      "Use gentle, non-abrasive skincare products",
      "Protect your face from sun and wind daily",
      "Manage stress levels with relaxation techniques",
      "Avoid extreme temperature changes",
    ],
  },
]

export function DiseaseGuide() {
  return (
    <section id="guide" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-foreground mb-4">
            Common Skin Conditions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about common skin conditions and the best preventive measures to keep your skin healthy and glowing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {diseases.map((disease, idx) => (
            <Card key={idx} className="p-6 bg-card/50 backdrop-blur-xl border border-white/10 hover:border-primary/50 shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-headline text-primary mb-2">{disease.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{disease.description}</p>

                  <div>
                    <p className="text-sm font-semibold text-primary/90 mb-3">Preventive Measures:</p>
                    <ul className="space-y-2">
                      {disease.precautions.map((precaution, i) => (
                        <li key={i} className="flex gap-3 items-start text-xs text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span>{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
