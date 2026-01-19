'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Users, Heart } from 'lucide-react'

export function About() {
  const stats = [
    { number: '10,000+', label: 'Safe Jumps' },
    { number: '15+', label: 'Years Experience' },
    { number: '6', label: 'Locations' },
    { number: '100%', label: 'Safety Record' }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every jump is conducted with the highest safety standards. Our equipment is inspected daily and our instructors are fully certified.'
    },
    {
      icon: Award,
      title: 'Expert Instructors',
      description: 'Our tandem masters have thousands of jumps under their belts. You\'re in experienced hands from training to landing.'
    },
    {
      icon: Users,
      title: 'Personalized Experience',
      description: 'Whether it\'s your first jump or your hundredth, we tailor the experience to make it unforgettable for you.'
    },
    {
      icon: Heart,
      title: 'Passion Driven',
      description: 'We love what we do. That passion translates into an incredible experience for every guest who jumps with us.'
    }
  ]

  return (
    <section id="about" className="relative py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-purple rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              About Us
            </span>
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            Why Choose Let's Skydive HK?
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            We're dedicated to delivering the safest, most thrilling skydiving experiences across Asia.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-card rounded-2xl clean-border"
            >
              <div className="text-3xl lg:text-4xl font-black text-accent-emerald mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 clean-border hover:elevated-shadow transition-all duration-300"
              >
                <div className="w-14 h-14 bg-accent-emerald/10 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-accent-emerald" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Story Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-accent-emerald/5 to-accent-blue/5 rounded-3xl p-8 lg:p-12 clean-border">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 text-center">
              Our Story
            </h3>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                Let's Skydive HK was founded by a group of passionate skydivers who wanted to share the incredible feeling of freefall with adventure seekers across Asia. What started as a single dropzone has grown into a network of world-class facilities across Thailand and China.
              </p>
              <p>
                Today, we're proud to be one of the most trusted names in Asian skydiving. Our team includes internationally certified instructors, riggers, and pilots who share one common goal: to give you the experience of a lifetime while maintaining the highest safety standards in the industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
