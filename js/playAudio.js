export function playAudio(url, volume){
    const sound = new Audio(url);
    sound.volume = volume;
    sound.play();
}