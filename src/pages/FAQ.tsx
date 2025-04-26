
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      
      <Card className="p-6">
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Sprout?</AccordionTrigger>
            <AccordionContent>
              Sprout is an innovative investing and savings app designed to help you grow your wealth. We combine smart investing strategies with easy-to-use savings tools to help you reach your financial goals.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How do I start investing with Sprout?</AccordionTrigger>
            <AccordionContent>
              Getting started is easy! Simply connect your bank account, choose your investment goals, and select from our range of carefully curated investment options. We'll help guide you through the process step by step.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Is my money safe with Sprout?</AccordionTrigger>
            <AccordionContent>
              Yes! Security is our top priority. We use bank-level encryption and security measures to protect your data and investments. Your investments are also protected by industry-standard insurance policies.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>How does Round-Ups investing work?</AccordionTrigger>
            <AccordionContent>
              Round-Ups automatically rounds up your purchases to the nearest dollar and invests the spare change. For example, if you spend $3.50, we'll round up to $4.00 and invest the $0.50 difference into your chosen investment portfolio.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Can I withdraw my money at any time?</AccordionTrigger>
            <AccordionContent>
              Yes, you can withdraw your money at any time. However, please note that investment withdrawals typically take 3-5 business days to process due to standard market settlement periods.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default FAQ;
