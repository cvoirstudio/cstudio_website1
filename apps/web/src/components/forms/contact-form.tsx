'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  service: z.enum(['photography', 'videography', 'web-development', 'other'], {
    error: () => 'Please select a service',
  }),
  budget: z.enum(['<5k', '5k-15k', '15k-50k', '50k+']).optional(),
  projectDate: z.string().optional(),
  message: z.string().min(20, 'Please tell us a bit more (min 20 characters)').max(2000),
  consent: z.literal(true, { error: () => 'You must agree to proceed' }),
})

type ContactFormData = z.infer<typeof contactSchema>

const serviceOptions = [
  { value: 'photography', label: 'Photography' },
  { value: 'videography', label: 'Videography' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'other', label: 'Other' },
] as const

const budgetOptions = [
  { value: '<5k', label: 'Under $5k' },
  { value: '5k-15k', label: '$5k – $15k' },
  { value: '15k-50k', label: '$15k – $50k' },
  { value: '50k+', label: '$50k+' },
] as const

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const selectedService = watch('service')

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        setServerError(json.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setServerError('Network error. Please check your connection.')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <CheckCircle size={48} className="text-brass" strokeWidth={1.5} />
        <div>
          <h3 className="font-display text-3xl font-light text-obsidian">Message received.</h3>
          <p className="font-body text-sm text-slate mt-2 max-w-[36ch]">
            We&apos;ll be in touch within 1–2 business days. While you wait, explore our work.
          </p>
        </div>
        <a
          href="/photography"
          className="font-body text-sm tracking-wide px-8 py-3 border border-brass text-brass hover:bg-brass hover:text-obsidian transition-all duration-200"
        >
          Explore Our Work
        </a>
      </div>
    )
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7" noValidate>
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-name" className="font-body text-[10px] tracking-[0.2em] text-obsidian uppercase">Name *</label>
          <input
            {...register('name')}
            id="cf-name"
            type="text"
            autoComplete="name"
            className="font-body text-sm px-4 py-3 border border-border bg-transparent text-obsidian placeholder:text-slate-light focus:outline-none focus:border-brass transition-colors duration-200"
            placeholder="Your full name"
          />
          {errors.name && <span className="font-body text-xs text-red-500">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-email" className="font-body text-[10px] tracking-[0.2em] text-obsidian uppercase">Email *</label>
          <input
            {...register('email')}
            id="cf-email"
            type="email"
            autoComplete="email"
            className="font-body text-sm px-4 py-3 border border-border bg-transparent text-obsidian placeholder:text-slate-light focus:outline-none focus:border-brass transition-colors duration-200"
            placeholder="you@company.com"
          />
          {errors.email && <span className="font-body text-xs text-red-500">{errors.email.message}</span>}
        </div>
      </div>

      {/* Phone */}
      <label className="flex flex-col gap-1.5">
        <span className="font-body text-[10px] tracking-[0.2em] text-obsidian uppercase">Phone (optional)</span>
        <input
          {...register('phone')}
          type="tel"
          autoComplete="tel"
          className="font-body text-sm px-4 py-3 border border-border bg-transparent text-obsidian placeholder:text-slate-light focus:outline-none focus:border-brass transition-colors duration-200"
          placeholder="+1 (555) 000-0000"
        />
      </label>

      {/* Service — radio cards */}
      <fieldset>
        <legend className="font-body text-[10px] tracking-[0.2em] text-obsidian uppercase mb-3">
          Service *
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {serviceOptions.map(({ value, label }) => (
            <label
              key={value}
              className={`cursor-pointer flex items-center justify-center text-center font-body text-xs tracking-wide py-3 px-2 border transition-all duration-200 ${
                selectedService === value
                  ? 'border-brass bg-brass/5 text-brass'
                  : 'border-border text-slate hover:border-brass/50 hover:text-obsidian'
              }`}
            >
              <input {...register('service')} type="radio" value={value} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
        {errors.service && <span className="font-body text-xs text-red-500 mt-1 block">{errors.service.message}</span>}
      </fieldset>

      {/* Budget + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-[10px] tracking-[0.2em] text-obsidian uppercase">Budget Range</span>
          <select
            {...register('budget')}
            className="font-body text-sm px-4 py-3 border border-border bg-transparent text-obsidian focus:outline-none focus:border-brass transition-colors duration-200 appearance-none"
          >
            <option value="">Select a range</option>
            {budgetOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-body text-[10px] tracking-[0.2em] text-obsidian uppercase">Project Date</span>
          <input
            {...register('projectDate')}
            type="date"
            className="font-body text-sm px-4 py-3 border border-border bg-transparent text-obsidian focus:outline-none focus:border-brass transition-colors duration-200"
          />
        </label>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-message" className="font-body text-[10px] tracking-[0.2em] text-obsidian uppercase">Message *</label>
        <textarea
          {...register('message')}
          id="cf-message"
          rows={5}
          className="font-body text-sm px-4 py-3 border border-border bg-transparent text-obsidian placeholder:text-slate-light focus:outline-none focus:border-brass transition-colors duration-200 resize-none"
          placeholder="Tell us about your project — the more detail, the better."
        />
        {errors.message && <span className="font-body text-xs text-red-500">{errors.message.message}</span>}
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          {...register('consent')}
          type="checkbox"
          className="mt-0.5 accent-[#B8922A]"
        />
        <span className="font-body text-xs text-slate leading-relaxed">
          I agree to Cvoir Studio processing my data to respond to this enquiry. I understand I can withdraw consent at any time.
        </span>
      </label>
      {errors.consent && <span className="font-body text-xs text-red-500 -mt-4">{errors.consent.message}</span>}

      {/* Server error */}
      {serverError && (
        <p className="font-body text-sm text-red-500 bg-red-50 px-4 py-3 border border-red-200">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="font-body text-sm tracking-wide py-4 bg-obsidian text-ivory hover:bg-obsidian/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
