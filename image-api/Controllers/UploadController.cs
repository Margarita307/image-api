using image_api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Win32;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net.Http.Headers;
using System.Text;

namespace image_api.Controllers
{
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private readonly IHostingEnvironment _env;

        public UploadController(IHostingEnvironment env)
        {
            _env = env;
        }

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult Upload(IFormCollection form)
        {
            try
            {
                var pathToSave = Path.Combine(_env.ContentRootPath, "Resources/Uploads");
                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }
                var files = form.Files;

                if (files.Count == 0)
                {
                    using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
                    {
                        var json = reader.ReadToEnd();
                        var data = Newtonsoft.Json.JsonConvert.DeserializeObject<UploadModel>(json);
                        if (data.ImageData.Length > 0)
                        {
                            var bytes = Convert.FromBase64String(data.ImageData);
                            var extension = Path.GetExtension(data.FileName);
                            if (String.IsNullOrEmpty(extension))
                            {
                                return BadRequest();
                            }
                            var fileName = $@"{Guid.NewGuid()}{extension}";
                            var fullPath = Path.Combine(pathToSave, fileName);

                            using (var stream = new FileStream(fullPath, FileMode.Create))
                            {
                                stream.Write(bytes, 0, bytes.Length);
                                stream.Flush();
                            }
                            return Ok(JsonConvert.SerializeObject(fullPath));
                        }
                        else
                        {
                            return BadRequest();
                        }
                    }
                }
                string fullPaths = "";
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                            
                        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var extension = Path.GetExtension(fileName);
                        if (String.IsNullOrEmpty(extension))
                        {
                            extension = GetDefaultExtension(file.ContentType);
                        }
                        if (String.IsNullOrEmpty(extension))
                        {
                            return BadRequest();
                        }
                        var newFileName = $@"{Guid.NewGuid()}{extension}";
                        var fullPath = Path.Combine(pathToSave, newFileName);
                        fullPaths += $"{fullPath} ";
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                return Ok(JsonConvert.SerializeObject(fullPaths));
            }
            catch (Exception ex)
            {
                return StatusCode(500, JsonConvert.SerializeObject("Internal server error"));
            }
        }

        public static string GetDefaultExtension(string mimeType)
        {
            string result;
            RegistryKey key;
            object value;

            key = Registry.ClassesRoot.OpenSubKey(@"MIME\Database\Content Type\" + mimeType, false);
            value = key != null ? key.GetValue("Extension", null) : null;
            result = value != null ? value.ToString() : string.Empty;

            return result;
        }
    }
}
