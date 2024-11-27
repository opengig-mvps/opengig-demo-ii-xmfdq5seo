'use client' ;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Heart, TrendingUp, MessageSquare, Info } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8] text-[#333]">
      <main className="flex-1">
        <section className="w-full py-16 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white">
          <div className="container px-4 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-5xl font-bold">Track Your Semen Health Seamlessly</h1>
                <p className="text-xl">
                  Monitor your semen health with key metrics, trends, and personalized goals right at your fingertips.
                </p>
                <div className="flex space-x-4">
                  <Button className="bg-white text-[#1D4ED8] hover:bg-gray-100">Get Started</Button>
                  <Button variant="outline" className="text-white border-white">Learn More</Button>
                </div>
              </div>
              <img
                src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
                alt="Semen Health"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 bg-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Personalized Insights and Recommendations</h2>
            <p className="text-lg text-gray-600 mb-8">
              Receive personalized recommendations, insights, and reminders to maintain healthy habits and prepare for upcoming tests.
            </p>
            <Card className="bg-[#EFF6FF] shadow-md mx-4">
              <CardHeader>
                <CardTitle>Track Your Habits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Log new semen reports, habits such as sleep and diet, and note lifestyle changes effortlessly.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="w-full py-12 bg-[#F3F4F6]">
          <div className="container px-4 mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Educational Articles</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Explore a wealth of articles on semen health to educate and empower yourself.
                </p>
              </div>
              <img
                src="https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY"
                alt="Articles"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 bg-white">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Connect with Community</h2>
            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>Join Discussions</AccordionTrigger>
                <AccordionContent>
                  Participate in forums, engage in Q&A sessions, and connect with experts and peers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Get Expert Advice</AccordionTrigger>
                <AccordionContent>
                  Interact with professionals to get the best advice and insights on semen health.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="bg-[#3B82F6] text-white py-6">
        <div className="container px-4 mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold">About Us</h3>
            <p>Learn about our mission and values.</p>
          </div>
          <div>
            <h3 className="font-bold">Contact</h3>
            <p>Contact us for more information.</p>
          </div>
          <div>
            <h3 className="font-bold">Follow Us</h3>
            <Badge className="bg-white text-[#3B82F6] mr-2">Facebook</Badge>
            <Badge className="bg-white text-[#3B82F6]">Twitter</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;