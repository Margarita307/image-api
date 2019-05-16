using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using image_api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace image_api.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        private readonly IHostingEnvironment _env;

        public ImageController(IHostingEnvironment env)
        {
            _env = env;
        }

        [HttpGet("[action]")]
        public IActionResult GetPortrait()
        {
            try
            {
                var pathToSave = Path.Combine(_env.ContentRootPath, "Resources/Images");
                var fileName = "img_portr_large.jpg";
                var fullPath = Path.Combine(pathToSave, fileName);
                var image = System.IO.File.OpenRead(fullPath);
                return File(image, "image/jpeg");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("[action]")]
        public IActionResult GetLandscape()
        {
            try
            {
                var pathToSave = Path.Combine(_env.ContentRootPath, "Resources/Images");
                var fileName = "img_landsc_large.jpg";
                var fullPath = Path.Combine(pathToSave, fileName);
                var image = System.IO.File.OpenRead(fullPath);
                return File(image, "image/jpeg");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
