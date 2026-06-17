import { Heart, Moon, Users, Leaf, Eye, Shield, BookOpen, Compass } from 'lucide-react';

const Manifesto = () => {
  const values = [
    {
      icon: Moon,
      title: "Silence is Sacred",
      description: "You don't owe anyone words. Lurking is not laziness—it's observation, reflection, processing. You can be here without performing. Your presence matters even when you're quiet.",
      color: "blue"
    },
    {
      icon: Heart,
      title: "Darkness is Welcome",
      description: "Your heavy feelings belong here. Depression, anxiety, grief, rage, emptiness—none of it is too much. We don't toxic-positive our way through pain. We sit with it, acknowledge it, and hold space for it.",
      color: "purple"
    },
    {
      icon: Users,
      title: "Depth Over Performance",
      description: "No one here wants your polished, Instagram-ready self. We want the raw, unfiltered, 3am thoughts. Authenticity beats wit. Vulnerability beats charisma. Real beats perfect.",
      color: "green"
    },
    {
      icon: Leaf,
      title: "Slow is Valid",
      description: "This is not Twitter. This is not TikTok. You can take days to respond. Weeks to process. Months to return. No one owes instant replies. Time pressure has no place here.",
      color: "teal"
    },
    {
      icon: Eye,
      title: "Questions Over Answers",
      description: "We're not here to fix each other. Sometimes the most powerful thing you can do is ask a good question and sit with not knowing. Uncertainty is not failure—it's honesty.",
      color: "indigo"
    },
    {
      icon: Shield,
      title: "Privacy is Sacred",
      description: "What's shared here stays here. We don't screenshot confessions. We don't weaponize vulnerability. We don't break trust. Your story is yours to tell—not ours to spread.",
      color: "red"
    },
    {
      icon: BookOpen,
      title: "Ideas Need Space",
      description: "Your weird theories, unconventional philosophies, and half-formed thoughts are welcome. Not every idea needs to be fully baked. Not every question needs an answer. Thinking out loud is encouraged.",
      color: "amber"
    },
    {
      icon: Compass,
      title: "Anti-Mainstream is Home",
      description: "Questioning religion? Rejecting hustle culture? Skeptical of societal norms? You're not broken—you're thinking critically. Your divergent path is valid. Your refusal to conform is respected.",
      color: "pink"
    }
  ];

  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-300",
    teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-300",
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-300",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
    pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-gray-100">
      {/* Hero Section - More Centered */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="mb-6 inline-block">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <Heart size={32} className="text-blue-300" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5 leading-tight">
            Our Manifesto
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            A sanctuary for the quiet, the deep, the misunderstood, and the unconventional
          </p>

          <div className="max-w-xl mx-auto text-gray-400 leading-relaxed space-y-3 text-sm md:text-base">
            <p>
              This space exists because the world is too loud for some of us. Too fast. Too shallow. 
              Too performative. Too exhausting.
            </p>
            <p>
              We built this for the introverts who need to recharge alone. For the deep thinkers who 
              can't do small talk. For the wounded who need time to heal. For the questioners who 
              refuse easy answers.
            </p>
            <p className="text-white font-medium">
              If you've ever felt like you don't fit, this is your space.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid - Smaller, Centered Cards */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className={`relative group bg-gradient-to-br ${colorClasses[value.color]} border rounded-xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors duration-500" />
                
                <div className="relative">
                  <div className="mb-4 flex justify-center">
                    <Icon size={28} className={`${value.color === 'blue' ? 'text-blue-400' : value.color === 'purple' ? 'text-purple-400' : value.color === 'green' ? 'text-green-400' : value.color === 'teal' ? 'text-teal-400' : value.color === 'indigo' ? 'text-indigo-400' : value.color === 'red' ? 'text-red-400' : value.color === 'amber' ? 'text-amber-400' : 'text-pink-400'}`} />
                  </div>
                  
                  <h3 className="text-xl font-medium text-white mb-3 text-center">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed text-sm text-center">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing Section - More Compact */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-5">
            What We're Not
          </h2>
          
          <div className="text-gray-400 leading-relaxed space-y-3 mb-10 text-sm md:text-base">
            <p>
              We're not a productivity cult. We're not here to optimize you, hustle-culture you, 
              or 10x your life. We're not about surface-level positivity or toxic optimism.
            </p>
            <p>
              We're not a place where you need to be funny, charming, or interesting. You don't 
              need to entertain us. You don't need to earn your place here.
            </p>
            <p>
              We're not judging your darkness, your silence, your weird ideas, or your inability 
              to "just get over it."
            </p>
          </div>

          <div className="border-t border-white/10 pt-10">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-5">
              What We Are
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto mb-8">
              A quiet corner of the internet where you can breathe. Where your heavy thoughts 
              have weight. Where your silence speaks volumes. Where you don't have to explain 
              yourself to belong.
            </p>

            <div className="inline-flex items-center gap-2 text-blue-300 bg-blue-500/10 px-5 py-2.5 rounded-full border border-blue-500/30">
              <Heart size={18} />
              <span className="font-medium text-sm">Welcome home, fellow traveler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <p className="text-center text-xs text-gray-500 leading-relaxed">
            This manifesto is a living document. As our community grows and evolves, so will 
            our understanding of what we need from each other. Your voice matters in shaping this space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
