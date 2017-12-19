export default function getVisualFromMessage(message, selectedVisual)  {

  if (message.data[1] === 22 && message.data[2] === 127 && selectedVisual !== 1) {
    return 1;
  }

  if (message.data[1] === 23 && message.data[2] === 127 && selectedVisual !== 2) {
    return 2;
  }

  if (message.data[1] === 24 && message.data[2] === 127 && selectedVisual !== 3) {
    return 3;
  }

  return false;
}
