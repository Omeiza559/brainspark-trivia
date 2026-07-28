/**
 * BrainSpark Lightweight HTML5 Canvas Confetti Synthesizer
 */

export function triggerConfetti(canvasElement) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    const width = (canvasElement.width = window.innerWidth);
    const height = (canvasElement.height = window.innerHeight);

    const particles = [];
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444'];

    for (let i = 0; i < 90; i++) {
        particles.push({
            x: width / 2 + (Math.random() - 0.5) * 200,
            y: height / 2,
            rx: Math.random() * 8 + 4,
            ry: Math.random() * 12 + 6,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 1.5) * 12 - 4,
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            gravity: 0.25
        });
    }

    let animationFrame;
    function render() {
        ctx.clearRect(0, 0, width, height);
        let activeParticles = 0;

        particles.forEach(p => {
            if (p.opacity <= 0) return;
            activeParticles++;

            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.rotation += p.vRot;
            p.opacity -= 0.008;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.rx / 2, -p.ry / 2, p.rx, p.ry);
            ctx.restore();
        });

        if (activeParticles > 0) {
            animationFrame = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, width, height);
            cancelAnimationFrame(animationFrame);
        }
    }

    render();
}
