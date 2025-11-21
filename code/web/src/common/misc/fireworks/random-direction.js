
import Confetti from 'canvas-confetti';

/**
 * 发射烟花
 */
export default function() {
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
      
    Confetti({
        angle        : randomInRange(55, 125),
        spread       : randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin       : { y: 0.6 }
    });
}