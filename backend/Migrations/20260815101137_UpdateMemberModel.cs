using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChurchPulse.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMemberModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Members",
                newName: "Surname");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Members",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Members",
                newName: "MobileNumber");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Members",
                newName: "FullNames");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "Members",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Members");

            migrationBuilder.RenameColumn(
                name: "Surname",
                table: "Members",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Members",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "MobileNumber",
                table: "Members",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "FullNames",
                table: "Members",
                newName: "Email");
        }
    }
}
