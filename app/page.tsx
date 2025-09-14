export default function Page() {
  return (
    <main>
      <h1>Vocab API</h1>
      <p>Health check: OK</p>
      <p>Try: <code>/api/v1/vocab/topics</code> or <code>/api/v1/vocab?topic=all&page=1&limit=20</code></p>
    </main>
  );
}