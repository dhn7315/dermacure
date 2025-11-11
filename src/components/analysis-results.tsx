'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplets, Sun, Leaf } from 'lucide-react';
import type { Prediction } from '@/app/actions';
import React from 'react';

type Props = {
  predictions: Prediction[];
  recommendations: string;
};

function formatTextToHtml(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, index) => {
    if (line.startsWith('- ')) {
      return <li key={index} className="ml-4 list-disc">{line.substring(2)}</li>;
    }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    return <p key={index}>{line}</p>;
  });
}

function parseRecommendations(recommendations: string) {
  const sections: { title: string; content: string; icon: React.ReactNode }[] = [];
  const recLower = recommendations.toLowerCase();

  const routineKeywords = ['morning routine', 'evening routine', 'daily routine'];
  const naturalKeywords = ['natural remedies'];
  const conventionalKeywords = ['conventional treatments', 'medical advice'];
  
  let remainingText = recommendations;

  const extractSection = (keywords: string[]): [string, string] => {
    for (const keyword of keywords) {
      const regex = new RegExp(`(^|\\n)(${keyword}[s]?:?)`, 'i');
      const match = remainingText.match(regex);
      if (match) {
        const title = match[2];
        const parts = remainingText.split(match[0]);
        const content = parts[1] || '';
        remainingText = parts[0] || '';
        return [title, content];
      }
    }
    return ['', ''];
  };

  const [naturalTitle, naturalContent] = extractSection(naturalKeywords);
  if(naturalContent) sections.push({title: naturalTitle, content: naturalContent, icon: <Leaf className="h-5 w-5 text-primary"/>});

  const [conventionalTitle, conventionalContent] = extractSection(conventionalKeywords);
  if(conventionalContent) sections.push({title: conventionalTitle, content: conventionalContent, icon: <Droplets className="h-5 w-5 text-primary"/>});
  
  const [routineTitle, routineContent] = extractSection(routineKeywords);
  if(routineContent) sections.push({title: routineTitle, content: routineContent, icon: <Sun className="h-5 w-5 text-primary"/>});
  
  if (remainingText.trim()) {
    sections.unshift({ title: 'Personalized Advice', content: remainingText.trim(), icon: <Leaf className="h-5 w-5 text-primary"/> });
  }

  return sections;
}


export default function AnalysisResults({ predictions, recommendations }: Props) {
  const chartData = predictions.map(p => ({
    name: p.condition.replace(/_/g, ' '),
    probability: Math.round(p.probability * 100),
  })).sort((a,b) => b.probability - a.probability);

  const recommendationSections = React.useMemo(() => parseRecommendations(recommendations), [recommendations]);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-12 animate-in fade-in-50 duration-500">
      <Card className="shadow-2xl bg-card/50 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Condition Analysis</CardTitle>
          <CardDescription>Based on your photo, here are the potential conditions our AI has identified.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: 'hsl(var(--foreground))' }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--foreground))', textTransform: 'capitalize' }} />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                    }}
                    cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                />
                <Bar dataKey="probability" barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-2xl bg-card/50 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Your Skincare Plan</CardTitle>
          <CardDescription>A personalized routine to help you achieve healthier skin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue={recommendationSections.length > 0 ? recommendationSections[0].title : undefined} className="w-full">
            {recommendationSections.map(section => section.content.trim() && (
              <AccordionItem value={section.title} key={section.title}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-primary/90">
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span className="capitalize">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-2 pl-2">
                  {formatTextToHtml(section.content)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
