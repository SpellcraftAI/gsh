import mic from "mic";
import { log, error } from "@tsmodule/log";

export const listenToMicrophone = (callback) => {
    const micInstance = mic({
        rate: '16000',
        channels: '1',
        debug: false,
        exitOnSilence: 6
    });
    const micInputStream = micInstance.getAudioStream();
    micInputStream.on('error', (err) => {
        error("Error in Input Stream: " + err);
    });
    micInputStream.on('silence', (data) => {
        // TODO: Send to API e.g. OpenAI's Whisper
        log("Got SIGNAL silence");
    });
    micInputStream.on('processExitComplete', () => {
        log("Got SIGNAL processExitComplete");
    });
    micInstance.start();
    return micInstance;
}
