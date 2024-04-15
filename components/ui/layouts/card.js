export default function Card({ children = null, className = "p-5" } = {}) {
  return (
    <section className={`w-full shadow-md bg-white rounded ${className}`}>
      {children}
    </section>
  );
}
