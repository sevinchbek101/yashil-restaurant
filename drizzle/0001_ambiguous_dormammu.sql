ALTER TABLE `orders` ADD `payment_status` text DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `checkout_payment_id` integer;--> statement-breakpoint
ALTER TABLE `orders` ADD `checkout_payment_uuid` text;