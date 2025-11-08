export function addBtnAnim(btn) {
    btn.addEventListener("mousedown", () => {
        btn.style.padding = "7px";
        btn.style.margin = "6px";
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.padding = '10px';
        btn.style.margin = "3px";
    });

    btn.addEventListener('mouseup', () => {
        btn.style.padding = '13px';
        btn.style.margin = "0px";
        setTimeout(() => {
            btn.style.padding = '10px';
            btn.style.margin = '3px';
        }, 150)
    });
}