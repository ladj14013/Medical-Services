
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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search, Wand2, Lightbulb } from 'lucide-react';
import { symptomCheck } from '@/ai/flows/symptom-checker';
import SearchDialog from './doctors/search-dialog';
import { doctors } from '@/lib/data';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<{ specialization: string; reasoning: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState('');

  const handleSymptomCheck = async () => {
    if (!symptoms) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await symptomCheck({ symptoms });
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
            لست متأكدًا من الطبيب الذي يجب أن تراه؟ صف أعراضك ودعنا نساعدك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="مثال: أشعر بألم في الصدر وضيق في التنفس عند صعود السلالم..."
              rows={5}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="text-base"
            />
            <Button
              size="lg"
              variant="accent"
              onClick={handleSymptomCheck}
              disabled={isLoading || !symptoms}
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
