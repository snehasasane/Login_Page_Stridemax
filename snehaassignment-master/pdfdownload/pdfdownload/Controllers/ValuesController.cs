using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using pdfdownload.Module;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;


namespace pdfdownload.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        public UserController(IConfiguration config)
        {
            _config = config;
        }
        [HttpGet]
        public IActionResult Login([FromQuery] string userNameOrEmail, [FromQuery] string password)
        {
            var userJson = "pdfdownload.Module.UserData.json";
            var UserDataList = JsonConvert.DeserializeObject<List<UserModule>>(ReadEmbeddedResource(userJson));
            var isUserexist = UserDataList.FirstOrDefault(x =>
                (x.UserNameOrEmail == userNameOrEmail || x.EmailAddress == userNameOrEmail) && x.Password == password);

            if (isUserexist == null)
            {
                return Unauthorized(new { success = false, message = "Username or Password is Invalid" });
            }
            var token = GenerateJwtToken(isUserexist);
            return Ok(new { success = true, token = token });
        }

        [HttpGet("{pdfname}")]
        public IActionResult ReadPdf(string pdfname)
        {
            var pdfResourceName = $"pdfdownload.samplepdf.{pdfname}.pdf";
            var pdfContent = ReadEmbeddedResourceAsBytes(pdfResourceName);
            if (pdfContent == null)
            {
                return NotFound(new { success = false, message = "PDF not found." });
            }
            var base64Pdf = Convert.ToBase64String(pdfContent);
            return Ok(new { success = true, base64Pdf = base64Pdf });
        }
        [HttpGet]
        public IActionResult GetAllPdf()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceNames = assembly.GetManifestResourceNames()
                                        .Where(name => name.StartsWith("pdfdownload.samplepdf") && name.EndsWith(".pdf"))
                                        .ToList();

            if (!resourceNames.Any())
            {
                return NotFound(new { success = false, message = "No Pdf found" });
            }

            var pdfFileNames = resourceNames.Select(name => name.Replace("pdfdownload.samplepdf.", "")).ToList();

            return Ok(new { success = true, pdfNames = pdfFileNames });
        }
        #region "Services Code"
        private static string ReadEmbeddedResource(string resourceName)
        {
            var assembly = Assembly.GetExecutingAssembly();

            using (var stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream == null)
                    throw new FileNotFoundException($"Resource '{resourceName}' not found.");

                using (var reader = new StreamReader(stream))
                {
                    return reader.ReadToEnd();
                }
            }
        }

        private string GenerateJwtToken(UserModule username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, username.UserNameOrEmail),
               new Claim(ClaimTypes.Email, username.EmailAddress)
             };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private byte[] ReadEmbeddedResourceAsBytes(string resourceName)
        {
            var assembly = Assembly.GetExecutingAssembly();
            using (var stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream == null)
                    return null;

                using (var memoryStream = new MemoryStream())
                {
                    stream.CopyTo(memoryStream);
                    return memoryStream.ToArray();
                }
            }
        }
        #endregion

    }
}
