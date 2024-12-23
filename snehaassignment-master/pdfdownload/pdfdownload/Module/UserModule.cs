namespace pdfdownload.Module
{
    public class UserModule
    {
        public string UserNameOrEmail { get; set; } 
        public string Password { get; set; }
        public string EmailAddress { get; set; }
     }



    public class UserModuleDto
    {
        public string UserNameOrEmail { get; set; }
        public string Password { get; set; }
    }
}
