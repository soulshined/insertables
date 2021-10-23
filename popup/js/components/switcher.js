export default class Switcher {

    constructor(element) {
        const switcherContentElement = element.nextElementSibling;
        const children = [...element.children];

        const activeIndex = Math.max([...element.children].findIndex(e => e.classList.contains('active')), 0);

        children[activeIndex].classList.add('active');
        if (switcherContentElement)
            switcherContentElement.children[activeIndex].classList.add('active');

        children.forEach((li, i) => li.addEventListener('click', ({ target }) => {
            if (target.tagName !== 'LI') target = target.closest('li');

            children.forEach(li => li.classList.remove('active'));
            target.classList.add('active');
            if (!switcherContentElement) return;

            [...switcherContentElement.childNodes].forEach((child, j) => {
                child.classList.remove('active');
                if (i === j) child.classList.add('active')
            })

        }))
    }

}