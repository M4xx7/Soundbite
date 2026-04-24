import Language from "./language.svg";
import Words from "./words.svg";
import Sound from "./sound.svg";
import Speedometer from "./speedometer.svg";
import Speech from "./speech.svg";
import PlayPause from "./play-pause.svg";
import Microphone from "./microphone.svg";
import StopRecording from "./stop-recording.svg";
import Analysis from "./analysis.svg";
import Score from "./score.svg";

export const Icons = {
  language: Language,
  words: Words,
  sound: Sound,
  speedometer: Speedometer,
  speech: Speech,
  playPause: PlayPause,
  microphone: Microphone,
  stopRecording: StopRecording,
  analysis: Analysis,
  score: Score,
};

export type IconName = keyof typeof Icons;
