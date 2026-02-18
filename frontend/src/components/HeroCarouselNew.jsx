import React, { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "./hero-new.css";

const slides = [
  { id: 1, image: "/images/Slider1.png", title: "New Season Arrivals", subtitle: "Discover the latest collection" },
  { id: 2, image: "/images/Slider2.jpeg", title: "Sports Meets Style", subtitle: "Crafted for perfection" },
  { id: 3, image: "/images/Slider3.jpeg", title: "Family Collection", subtitle: "Style for everyone" }
];

export default function HeroCarouselNew() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="osai-hero-container mt-4 mb-5">
      <div
        key={currentSlide}
        className="osai-hero-slide"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      >
        <div className="osai-hero-overlay" />

        <div className="osai-hero-content text-center">
          <h2 className="osai-hero-title">{slides[currentSlide].title}</h2>
          <p className="osai-hero-sub">{slides[currentSlide].subtitle}</p>
        </div>
      </div>

      <button onClick={prevSlide} className="osai-hero-nav left" aria-label="Previous slide">
        <AiOutlineLeft />
      </button>

      <button onClick={nextSlide} className="osai-hero-nav right" aria-label="Next slide">
        <AiOutlineRight />
      </button>

      <div className="osai-hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={index === currentSlide ? "dot active" : "dot"}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
