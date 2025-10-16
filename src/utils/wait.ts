export default async function wait(duration: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(res, duration);
  });
}
