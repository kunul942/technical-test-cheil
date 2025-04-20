public class TodoTask
{
    public int Id { get; set; }
    public string? Title { get; set; } // Opción 2: Hacer nullable
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int UserId { get; set; }
}