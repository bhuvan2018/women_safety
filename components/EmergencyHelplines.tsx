  "use client"

  import { motion } from "framer-motion"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { Phone } from "lucide-react"

  export default function EmergencyHelplines() {
    const helplines = [
      {
        name: "SHAKTI SHALINI",
        number: "+10920 or (011) 24373736",
        description:
          "Driven by the vision of a world where all women enjoy full citizenship, earn a livelihood with dignity and generate wealth and value for all.",
      },
      {
        name: "WOMEN POLICE STATION",
        number: "+918251233500",
        description:
          "Aims to reduce domestic violence through thousands of PeaceMakers who are trained in family and marriage counseling and all aspects of the Domestic Violence Act.",
      },
      {
        name: "CHILD WELFARE COMMITTEE",
        number: "08251230388",
        description:
          "Provides support to victims, from all over the country and abroad, of abuse and violence in order to empower them to become survivors.",
      },
    ]

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-orange-500">
          DOMESTIC VIOLENCE | HELPLINES
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {helplines.map((helpline, index) => (
            <Card key={index} className="bg-card">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{helpline.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm md:text-base text-muted-foreground">{helpline.description}</p>
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  onClick={() => (window.location.href = `tel:${helpline.number}`)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {helpline.number}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    )
  }