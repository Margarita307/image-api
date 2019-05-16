using image_api;
using image_api.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace image_api_tests
{
    public class UploadControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        string _testDataFolder = "../../../TestData";

        public UploadControllerIntegrationTests(CustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task CanUploadImageAsJson()
        {
            var testFile = Path.Combine(_testDataFolder, "request.json");
            var testFileContent = File.ReadAllText(testFile);
            var httpContent = new StringContent(testFileContent, Encoding.UTF8, "application/json");

            var httpResponse = await _client.PostAsync("/api/upload", httpContent);
            httpResponse.EnsureSuccessStatusCode();

            var respContent = await httpResponse.Content.ReadAsStringAsync();
            var uploadedFile = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(respContent);
            byte[] imageArray = System.IO.File.ReadAllBytes(uploadedFile);
            string base64ImageRepresentation = Convert.ToBase64String(imageArray);
            var testFileData = Newtonsoft.Json.JsonConvert.DeserializeObject<UploadModel>(testFileContent);
            Assert.Equal(testFileData.ImageData, base64ImageRepresentation);
        }

        [Fact]
        public async Task CanUploadMultipleImagesAsFormData()
        {
            var httpContent = new MultipartFormDataContent();
            string[] testFileNames = { "img_landsc_large.jpg", "img_portr_large.jpg" };
            var testFileArrays = new List<byte[]>();
            foreach (var testFileName in testFileNames)
            {
                var testFile = Path.Combine(Path.Combine(_testDataFolder, "Images"), testFileName);
                var testFileArray = File.ReadAllBytes(testFile);
                testFileArrays.Add(testFileArray);
                var imageContent = new ByteArrayContent(testFileArray);
                imageContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");
                httpContent.Add(imageContent, "image", testFileName);
            }

            var httpResponse = await _client.PostAsync("/api/upload", httpContent);
            httpResponse.EnsureSuccessStatusCode();

            var respContent = await httpResponse.Content.ReadAsStringAsync();
            var uploadedFiles = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(respContent)
                .Split(new char[] { ' '}, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < testFileArrays.Count; i++)
            {
                Assert.Equal(testFileArrays[i], File.ReadAllBytes(uploadedFiles[i]));
            }
        }
    }
}
