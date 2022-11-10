using System.ComponentModel.DataAnnotations;

namespace BlobBrowser;

public record AuthorizationUserDTO(
    [Required] string Username,
    [Required] string Password);