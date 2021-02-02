[ ] - sorting bug. Сортировка может происходить в неправильном порядке, из-за того, что в tableReducer 2 поля: sortField и sortDirection. Как воспроизвести: чередовать сортировку.
[ ] - Т.к. запрос - это история асинхронная, нужно использовать middleware: redux-thunk или redux-saga
[ ] - Я мог бы сделать reject, что бы добавить плагин [babel-plugin-typescript-to-proptypes](https://github.com/milesj/babel-plugin-typescript-to-proptypes). Позволяет генерить PropTypes из интерфейсов TypeScript
