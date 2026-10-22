/**
 * Startet eine weiche Loading-Animation in der CLI.
 *
 * Beispiel:
 *   const loader = startSoftLoader('Das Spiel wird gestartet');
 *   // ... Arbeit ...
 *   loader.stop();
 */
export function startSoftLoader(
  message: string = 'Lade Daten',
  intervalMs: number = 300,
  cycles: number = 3
) {
  let frame = 0;
  const totalFrames = cycles * 4;

  process.stdout.write('\x1B[?25l');

  const timer = setInterval(() => {
    const dots = ['', '.', '..', '...'][frame % 4] ?? '';
    process.stdout.write(`\r\x1B[K${message}${dots}`);

    frame++;

    if (frame >= totalFrames) {
      clearInterval(timer);
      process.stdout.write('\r\x1B[K');
      process.stdout.write('\x1B[?25h');
    }
  }, intervalMs);

  return {
    stop: () => {
      clearInterval(timer);
      process.stdout.write('\r\x1B[K');
      process.stdout.write('\x1B[?25h');
    }
  };
}
