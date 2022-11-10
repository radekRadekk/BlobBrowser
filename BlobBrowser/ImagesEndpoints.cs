using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;

namespace BlobBrowser;

public static class ImagesEndpoints
{
    public static void UseImagesEndpoints(this WebApplication app)
    {
        app.MapGet("/images/info", [Authorize](IConfiguration configuration) =>
        {
            var blobServiceClient = new BlobServiceClient(configuration["blobConnectionString"]);
            var containerClient = blobServiceClient.GetBlobContainerClient(configuration["blobContainerName"]);

            var blobsNum = containerClient.GetBlobs().Count();

            return blobsNum;
        });

        app.MapGet("/images/{id:int}", [Authorize](IConfiguration configuration, int id) =>
        {
            var blobServiceClient = new BlobServiceClient(configuration["blobConnectionString"]);
            var containerClient = blobServiceClient.GetBlobContainerClient(configuration["blobContainerName"]);

            var blobsNum = containerClient.GetBlobs().Count();
            if (id > blobsNum || id < 1)
            {
                return Results.BadRequest();
            }

            var blobName = containerClient.GetBlobs().Skip(id - 1).First().Name;
            var x = new BlobClient(configuration["blobConnectionString"], configuration["blobContainerName"], blobName);
            using var memoryStream = new MemoryStream();
            x.DownloadTo(memoryStream);
            return Results.Ok(Convert.ToBase64String(memoryStream.ToArray()));
        });
    }
}