export default class AbstractModal extends HTMLElement {
    constructor() {
        super();

        const modal = new TagBuilder('div').classes('modal')
            .on('click', function (e) {
                if (e.target.classList.contains('modal')) {
                    e.target.parentElement.remove();
                    e.target.parentElement.dispatchEvent(new CustomEvent('removed'));
                }
            })
            .append(
                new TagBuilder('form').classes('container').append(
                    new TagBuilder('div').classes('header'),
                    new TagBuilder('div').classes('body'),
                    new TagBuilder('div').classes('footer')
                )
            )

        this.appendChild(modal.build());
    }

    set header(html) {
        this.querySelector('.header').innerHTML = html;
    }

    set body(html) {
        this.querySelector('.body').innerHTML = html;
    }

    set footer(html) {
        this.querySelector('.footer').innerHTML = html;
    }

}