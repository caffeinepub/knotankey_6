import { Clock, Mail, Package, RotateCcw, Video } from "lucide-react";

const POLICY_CARDS = [
  {
    icon: Clock,
    title: "7-Day Return Window",
    description:
      "Returns must be initiated within 7 days of delivery. So initiate the return as soon as possible.",
  },
  {
    icon: Package,
    title: "Original Condition",
    description:
      "Items must be unused, unwashed, and in their original packaging with all tags attached.",
  },
  {
    icon: Video,
    title: "Unboxing Video Required",
    description:
      "You must attach an unboxing video of the product showing its condition. Returns will only be reviewed after the email and video proof are received.",
  },
  {
    icon: Mail,
    title: "Contact Us First",
    description:
      "Please email us at knotankey@gmail.com to request a return. Include your Order Number, Customer Name, and Reason for Return.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <RotateCcw className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground font-serif mb-3">
            Returns & Exchanges
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We want you to love your purchase. If something isn't right, we're
            here to help.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {POLICY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-card border border-border rounded-xl p-5 flex gap-4"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Returns Process Instructions */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground font-serif mb-6">
            Returns Process
          </h2>

          <p className="text-muted-foreground mb-6">
            If you would like to request a return, please contact us through
            email.
          </p>

          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <a
              href="mailto:knotankey@gmail.com"
              className="text-primary hover:underline font-medium text-base"
            >
              knotankey@gmail.com
            </a>
          </div>

          <div className="space-y-4">
            <p className="text-foreground font-medium">
              Please include the following details in your email:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
              <li>Order Number</li>
              <li>Customer Name</li>
              <li>Reason for Return</li>
            </ul>

            <p className="text-muted-foreground mt-4">
              You must also attach an unboxing video of the product showing its
              condition.
            </p>

            <p className="text-sm text-muted-foreground italic border-t border-border pt-4 mt-4">
              Returns will only be reviewed after the email and video proof are
              received.
            </p>
          </div>
        </div>

        {/* Contact Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Questions? Email us at{" "}
          <a
            href="mailto:knotankey@gmail.com"
            className="text-primary hover:underline font-medium"
          >
            knotankey@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
