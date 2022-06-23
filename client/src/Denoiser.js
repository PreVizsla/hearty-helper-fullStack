import wt from 'discrete-wavelets';

import { resample } from 'wave-resampler';

class Denoiser {

    constructor(inputOri) {
        // input sound
        // change sound to wavelets (mirror sampling)
        let coeffs = wt.wavedec([...inputOri], 'db10', 'symmetric', 7);
        this.coeffs = coeffs[0]

    }

    dwtDenoise() {

        let resampled = resample(this.coeffs.slice(0, 3460), 346, 10000, {method: "sinc"});
        let resampledLow = resample(this.coeffs.slice(0, 3460), 346, 100, {method: "sinc"});
        return [resampled, resampledLow]
    }

}

export default Denoiser;
