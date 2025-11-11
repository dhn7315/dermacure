'use client';

import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisSuccess, AnalysisError } from '@/app/actions';
import { handleImageAnalysisAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud, X, LoaderCircle } from 'lucide-react';
import AnalysisResults from './analysis-results';
import ThreeDeeSkinModel from './3d-skin-model';

export default function SkinAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisSuccess | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please select an image smaller than 4MB.',
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    handleRemoveImage();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !preview) {
      toast({ variant: 'destructive', title: 'No image selected', description: 'Please upload an image to analyze.' });
      return;
    }
    
    startTransition(async () => {
      setResult(null);
      const analysisResult = await handleImageAnalysisAction(preview);
      if ('error' in analysisResult) {
        toast({ variant: 'destructive', title: 'Analysis Failed', description: (analysisResult as AnalysisError).error });
      } else {
        setResult(analysisResult as AnalysisSuccess);
      }
    });
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="w-64 h-64 mx-auto mb-6">
          <ThreeDeeSkinModel />
        </div>
        <h2 className="text-3xl font-bold font-headline animate-pulse text-primary">Analyzing Your Skin...</h2>
        <p className="text-muted-foreground mt-2 max-w-md">Our AI is looking closely. This might take a moment. Please don't refresh the page.</p>
      </div>
    );
  }

  if (result) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <AnalysisResults predictions={result.predictions} recommendations={result.recommendations} />
            <div className="text-center mt-12">
            <Button onClick={resetAnalysis} size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">Start New Analysis</Button>
            </div>
        </div>
      </section>
    );
  }

  return (
    <>
       <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
           <ThreeDeeSkinModel />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 min-h-[60vh] md:min-h-[calc(100vh-10rem)] flex items-center">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl text-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-7xl font-bold font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-foreground">
                Unlock Radiant Skin with AI
              </h1>
              <p className="text-lg text-muted-foreground">
                Welcome to DERMA CARE. Upload a photo and let our advanced AI provide you with insights and a personalized care routine.
              </p>
            </div>
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
               <Image src="/skin-hero.jpg?v=1.0" alt="Hero image" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
      
      <section id="analysis" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-2xl bg-card/50 backdrop-blur-xl border border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline text-primary">Begin Your Analysis</CardTitle>
              <CardDescription>Upload a clear, well-lit photo of the area of concern.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div
                    className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-primary/30 hover:border-primary transition-colors bg-background/50 hover:bg-primary/5"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <>
                        <Image src={preview} alt="Skin preview" fill className="object-contain rounded-lg p-2" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadCloud className="w-10 h-10 mb-3 text-primary" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary/80">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 4MB)</p>
                      </div>
                    )}
                    <Input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                  </div>
                </div>
                <button type="submit" disabled={!file || isPending} className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-primary/50 active:scale-100 disabled:pointer-events-none disabled:opacity-50">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-75" />
                  <div className="absolute inset-0 rounded-full bg-primary" />
                  <div className="relative flex items-center gap-2">
                  {isPending ? <LoaderCircle className="h-6 w-6 animate-spin" /> : 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-500 group-hover:rotate-12">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"></path>
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"></path>
                    </svg>
                  }
                  <span>Analyze My Skin</span>
                  </div>
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
