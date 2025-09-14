
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search, Wand2, Lightbulb, Plus, X } from 'lucide-react';
import { symptomCheck } from '@/ai/flows/symptom-checker';
import SearchDialog from './doctors/search-dialog';
import { doctors } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function SymptomChecker() {
  const [symptomsList, setSymptomsList] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [result, setResult] = useState<{ specialization: string; reasoning: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState('');

  const handleAddSymptom = () => {
    if (currentSymptom.trim()) {
      setSymptomsList([...symptomsList, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const handleRemoveSymptom = (indexToRemove: number) => {
    setSymptomsList(symptomsList.filter((_, index) => index !== indexToRemove));
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSymptom();
    }
  };

  const handleSymptomCheck = async () => {
    if (symptomsList.length === 0) return;
    setIsLoading(true);
    setResult(null);
    try {
      const symptomsString = symptomsList.join('\n- ');
      const response = await symptomCheck({ symptoms: `- ${symptomsString}` });
      setResult(response);
    } catch (error) {
      console.error('Symptom check error:', error);
      setResult({
        specialization: 'خطأ',
        reasoning: 'عذرًا، حدث خطأ أثناء محاولة تحليل الأعراض. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchForSpecialist = () => {
    if(result?.specialization) {
      setInitialSearchTerm(result.specialization);
      setIsSearchDialogOpen(true);
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tight font-headline flex items-center justify-center gap-3">
            <Wand2 className="h-8 w-8 text-primary" />
            فحص الأعراض بالذكاء الاصطناعي
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            لست متأكدًا من الطبيب الذي يجب أن تراه؟ أضف أعراضك ودعنا نساعدك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="مثال: ألم في الصدر"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-base"
              />
              <Button variant="outline" onClick={handleAddSymptom} disabled={!currentSymptom.trim()}>
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline sm:mr-2">إضافة عرض</span>
              </Button>
            </div>
             {symptomsList.length > 0 && (
                <div className="p-4 border rounded-lg bg-muted/50 flex flex-wrap gap-2">
                    {symptomsList.map((symptom, index) => (
                    <Badge key={index} variant="secondary" className="text-base py-1 px-3 flex items-center gap-2">
                        {symptom}
                        <button onClick={() => handleRemoveSymptom(index)} className="rounded-full hover:bg-destructive/20 p-0.5">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
            )}
            <Button
              size="lg"
              variant="accent"
              onClick={handleSymptomCheck}
              disabled={isLoading || symptomsList.length === 0}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <Wand2 className="ml-2 h-5 w-5" />
                  تحليل الأعراض
                </>
              )}
            </Button>
          </div>
        </CardContent>

        {result && (
          <CardFooter>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className='font-headline'>
                التوصية: {result.specialization}
              </AlertTitle>
              <AlertDescription className="text-right">
                {result.reasoning}
              </AlertDescription>
              {result.specialization !== 'خطأ' && (
                <div className='mt-4 flex justify-end'>
                    <Button variant="outline" size="sm" onClick={handleSearchForSpecialist}>
                        <Search className="ml-2 h-4 w-4" />
                        ابحث عن طبيب {result.specialization}
                    </Button>
                </div>
              )}
            </Alert>
          </CardFooter>
        )}
      </Card>
      <SearchDialog
        isOpen={isSearchDialogOpen}
        setIsOpen={setIsSearchDialogOpen}
        doctors={doctors}
        initialSearch={initialSearchTerm}
      />
    </>
  );
}
