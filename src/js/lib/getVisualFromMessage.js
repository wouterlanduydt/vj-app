export default function getVisualFromMessage(message, selectedVisual)  {

  if (message.data[1] === 37 && message.data[2] === 127 && selectedVisual !== 1) {
    return 1;
  }

  if (message.data[1] === 38 && message.data[2] === 127 && selectedVisual !== 2) {
    return 2;
  }

  if (message.data[1] === 39 && message.data[2] === 127 && selectedVisual !== 3) {
    return 3;
  }

  if (message.data[1] === 40 && message.data[2] === 127 && selectedVisual !== 4) {
    return 4;
  }

  return false;
}
