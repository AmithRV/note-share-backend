function generateUniqueId() {
  const timestamp = new Date().getTime().toString(16);
  const randomPart = Math.floor(Math.random() * 10000).toString(16);
  return `${timestamp}-${randomPart}`;
}

export { generateUniqueId };
