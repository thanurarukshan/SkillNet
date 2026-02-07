export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center py-32 px-4 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <Typography variant="h1" className="text-white mb-6 font-bold tracking-tight">
            Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Collaborate.</span> Create.
          </Typography>
          <Typography variant="h5" className="text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            The ultimate platform bridging the gap between Students, SMEs, and Industry Leaders.
            Find opportunities, solve real-world problems, and build your future.
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="contained"
              size="large"
              className="bg-white text-indigo-900 hover:bg-slate-100 px-8 py-3 text-lg font-bold"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              className="border-slate-300 text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-white">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-slate-900 mb-4">
              Why SkillNet?
            </Typography>
            <Typography variant="h6" className="text-slate-500 max-w-2xl mx-auto">
              We provide the ecosystem for growth, innovation, and career acceleration.
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For Students",
                desc: "Showcase your portfolio, apply for internships, and work on real industry projects.",
                icon: "🎓"
              },
              {
                title: "For SMEs",
                desc: "Find affordable talent, get technical solutions, and grow your business.",
                icon: "🚀"
              },
              {
                title: "For Companies",
                desc: "Recruit top talent, collaborate with universities, and drive innovation.",
                icon: "🏢"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <Typography variant="h4" className="mb-4 text-slate-800">{feature.title}</Typography>
                <Typography className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <Container maxWidth="md">
          <Typography variant="h3" className="mb-6 font-bold">
            Ready to Join the Network?
          </Typography>
          <Typography variant="h6" className="text-slate-400 mb-8">
            Join thousands of students and companies already building the future.
          </Typography>
          <Button variant="contained" color="primary" size="large" className="px-10 py-3 text-lg">
            Create Free Account
          </Button>
        </Container>
      </section>
    </div>
  );
}

import { Typography, Container, Button } from "@mui/material";
