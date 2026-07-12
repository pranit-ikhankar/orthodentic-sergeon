import React from "react";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      text: "The entire team made me feel confident from my very first consultation. My knee replacement surgery went smoothly, and the post-op care completely exceeded my expectations.",
      treatment: "Total Knee Replacement",
    },
    {
      name: "Priya Patel",
      text: "Finally found an orthopedic surgeon who truly listens and cares. The diagnosis was precise, and the non-surgical treatment plan completely resolved my shoulder pain.",
      treatment: "Sports Medicine",
    },
    {
      name: "Amit Verma",
      text: "I was incredibly nervous about undergoing spinal surgery, but every step of the arthroscopic procedure was explained clearly. I am finally living entirely pain-free.",
      treatment: "Spine & Back Care",
    },
    {
      name: "Sneha Kapoor",
      text: "Exceptional medical care. The clinic utilizes incredibly advanced technology, and the targeted physical therapy program helped me get back on my feet much faster than expected.",
      treatment: "Physical Rehabilitation",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Patient Stories
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Hear what our patients have to say about their experiences with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-slate-100"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-slate-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-900">
                  {testimonial.name}
                </p>
                <p className="text-sm text-blue-600">
                  {testimonial.treatment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;