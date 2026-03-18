const mapWithConcurrency = async (items, worker, concurrency = 2) => {
  if (!Array.isArray(items)) {
    throw new Error('items must be an array');
  }

  if (typeof worker !== 'function') {
    throw new Error('worker must be a function');
  }

  if (items.length === 0) {
    return [];
  }

  const safeConcurrency = Math.max(1, Number(concurrency) || 1);
  const results = new Array(items.length);
  let nextIndex = 0;

  const runWorker = async () => {
    while (true) {
      const currentIndex = nextIndex;
      if (currentIndex >= items.length) {
        return;
      }

      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  };

  const workerCount = Math.min(safeConcurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));

  return results;
};

module.exports = {
  mapWithConcurrency
};
