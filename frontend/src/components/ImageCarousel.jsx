import { useState } from 'react';

export default function ImageCarousel({ images, alt }) {
  const [index, setIndex] = useState(0);
  if (!images || images.length === 0) return null;

  function prev(e) {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next(e) {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="carousel">
      <img src={images[index]} alt={alt} className="carousel-img" />
      {images.length > 1 && (
        <>
          <button type="button" className="carousel-nav carousel-nav-prev" onClick={prev} aria-label="Sebelumnya">‹</button>
          <button type="button" className="carousel-nav carousel-nav-next" onClick={next} aria-label="Selanjutnya">›</button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                type="button"
                key={i}
                className={`carousel-dot${i === index ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                aria-label={`Gambar ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
