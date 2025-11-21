
import Confetti from 'canvas-confetti';

/**
 * 
 * 发射烟花
 * 
 * @param {*} timems 
 */
export default function(timems = 8000) {
    const end = Date.now() + timems;
    const colors = ['#bb0000', '#ffffff'];
    (function frame() {
        Confetti({
            particleCount: 3,
            angle: 60,
            spread: 180,
            origin: { x: 0 },
            colors: colors
        });

        Confetti({
            particleCount: 3,
            angle: 120,
            spread: 180,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}