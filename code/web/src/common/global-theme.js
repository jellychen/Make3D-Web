
/**
 * 主题, 目前就实现了 Dark
 */
class ThemeSetter {
    /**
     * 
     * 设置使用的主题
     * 
     * @param {*} theme 
     */
    set(theme) {
        const body = document.body;
        while (body.classList.length > 0) {
            body.classList.remove(body.classList[0]);
        }
        body.classList.add(theme);
    }

    /**
     * 设置黑色
     */
    setDark() {
        this.set('theme-dark');
    }

    /**
     * 设置亮色
     */
    setLightness() {
        this.set('theme-lightness');
    }
};

export default new ThemeSetter();
