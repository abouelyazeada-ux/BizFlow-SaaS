namespace BizFlow.Infrastructure.Reports;

using System;
using System.IO;
using BizFlow.Application.Reports;
using BizFlow.Application.Reports.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

public class QuestPdfReportGenerator : IReportGenerator
{
    public QuestPdfReportGenerator()
    {
    }

    public byte[] GenerateDashboardReport(DashboardReportDto data)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Element(compose => ComposeHeader(compose));
                page.Content().Element(compose => ComposeContent(compose, data));
                page.Footer().Element(compose => ComposeFooter(compose));
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("BizFlow Report").FontSize(24).SemiBold().FontColor(Colors.Blue.Darken2);
                column.Item().Text($"Generated on {DateTime.Now:MMMM dd, yyyy}").FontSize(12).FontColor(Colors.Grey.Darken1);
            });
        });
    }

    private void ComposeContent(IContainer container, DashboardReportDto data)
    {
        container.PaddingVertical(1, Unit.Centimetre).Column(column =>
        {
            column.Spacing(20);

            // 1. Business Overview
            column.Item().Text("1. Business Overview").FontSize(16).SemiBold();
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                table.Cell().Element(Block).Text($"Total Revenue: {data.Overview.TotalRevenue:C}");
                table.Cell().Element(Block).Text($"Total Invoices: {data.Overview.TotalInvoices}");
                table.Cell().Element(Block).Text($"Total Customers: {data.Overview.TotalCustomers}");
                table.Cell().Element(Block).Text($"Total Products: {data.Overview.TotalProducts}");

                static IContainer Block(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                }
            });

            // 2. Sales Summary
            column.Item().Text("2. Sales Summary").FontSize(16).SemiBold();
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                int paid = data.Overview.TotalInvoices - data.Overview.PendingInvoicesCount;
                var avg = data.Overview.TotalInvoices > 0 ? data.Overview.TotalRevenue / data.Overview.TotalInvoices : 0;
                
                table.Cell().Element(Block).Text($"Paid Invoices: {paid}");
                table.Cell().Element(Block).Text($"Pending Invoices: {data.Overview.PendingInvoicesCount}");
                table.Cell().Element(Block).Text($"Average Invoice Value: {avg:C}");
                table.Cell().Element(Block).Text($"Total Sales Trend Points: {data.Sales.RevenueByDay.Count}");

                static IContainer Block(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                }
            });

            // 3. Inventory Summary
            column.Item().Text("3. Inventory Summary").FontSize(16).SemiBold();
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                table.Cell().Element(Block).Text($"Total Inventory Value: {data.Inventory.TotalInventoryValue:C}");
                table.Cell().Element(Block).Text($"Low Stock Products: {data.Inventory.LowStockProductsCount}");
                table.Cell().Element(Block).Text($"Out of Stock Products: {data.Inventory.OutOfStockProductsCount}");
                table.Cell().Element(Block).Text($"Total Items: {data.Overview.TotalProducts}");

                static IContainer Block(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                }
            });

            // 4. Recent Activity
            column.Item().Text("4. Recent Activity").FontSize(16).SemiBold();
            if (data.RecentActivities.Count > 0)
            {
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(120);
                        columns.RelativeColumn();
                    });
                    
                    table.Header(header =>
                    {
                        header.Cell().Text("Date").SemiBold();
                        header.Cell().Text("Activity").SemiBold();
                    });

                    foreach (var activity in data.RecentActivities)
                    {
                        table.Cell().PaddingVertical(2).Text(activity.Timestamp.ToString("yyyy-MM-dd HH:mm"));
                        table.Cell().PaddingVertical(2).Text(activity.Description);
                    }
                });
            }
            else
            {
                column.Item().Text("No recent activities.").FontColor(Colors.Grey.Medium);
            }
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text(x =>
        {
            x.Span("Page ");
            x.CurrentPageNumber();
            x.Span(" of ");
            x.TotalPages();
        });
    }
}
