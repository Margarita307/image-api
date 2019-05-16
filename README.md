1. Никаких специальных действий по сборке и запуску не требуется.
2. Загруженные изображения помещаются в папку Resources/Uploads.
3. Образцы изображений для загрузки можно найти в папке Resources/Images.
4. Для проверки загрузки изображений по URL можно использовать методы ImageController, доступные по адресам /api/Image/GetPortrait и /api/Image/GetLandcape.
5. JSON запросы с BASE64 закодированными изображениями отправлять на адрес /api/upload. Тело запроса должно выглядеть следующим образом:
{
"FileName" : "Image.jpg",
"ImageData" : "/9j/4AAQ...
}.
Обратите внимание, что BASE64 закодированное изображение не содержит префикса data:image/jpeg;base64. Важно указать FileName, так как оно содержит расширение файла. Образец тела запроса находится в папке TestData тестового проекта.

<br/>

1. No special build and launch actions are required.
2. Downloaded images are placed in the Resources/Uploads folder.
3. Samples of images for download can be found in the Resources/Images folder.
4. You can use the ImageController methods available at /api/Image/GetPortrait and /api/Image/GetLandcape to check image downloads by URL.
5. JSON requests with BASE64 encoded images should be send to /api/upload. The request body should look like:
{
"FileName" : "Image.jpg",
"ImageData" : "/9j/4AAQ...
}.
Please, pay attention that BASE64 encoded image should not contain the data:image/jpeg;base64 prefix. FileName is important as it containes file extension. The sample request body is located in the TestData folder of the test project.
